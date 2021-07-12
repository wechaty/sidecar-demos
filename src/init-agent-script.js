/**
 * WeChat 3.2.1.121
 *  > Special thanks to: @cixingguangming55555 老张学技术
 *
 * Credit: https://github.com/cixingguangming55555/wechat-bot
 * Source: https://pan.baidu.com/s/1OmX2lxNOYHyGsl_3ByhsoA
 *        《源码3.2.1.121》提取码: 1rfa
 * WeChat: https://pan.baidu.com/share/init?surl=IHRM2OMvrLyuCz5MRbigGg
 *         微信：3.2.1.121 提取码: cscn
 */
 const moduleBaseAddress = Module.getBaseAddress('WeChatWin.dll')

 /**
  * @Hook: recvMsg -> agentRecvMsgNativeCallback
  */
const recvMsgNativeCallback = (() => {
  const nativeCallback      = new NativeCallback(() => {}, 'void', ['pointer', 'pointer'])
  const nativeativeFunction = new NativeFunction(agentRecvMsgNativeCallback, 'void', ['pointer', 'pointer'])

  Interceptor.attach(
    moduleBaseAddress.add(0x3de6fd),
    {
      onEnter() {
        const addr = this.context.ebp.sub(0xc14)

        const talkerIdPtr = addr.add(0x40).readPointer()
        const contentPtr  = addr.add(0x68).readPointer()

        setImmediate(() => nativeativeFunction(talkerIdPtr, contentPtr))
      }
  })
  return nativeCallback
})()

/**
 * @Call: sendMsg -> agentSendMsg
 */
const sendMsgNativeFunction = (() => {
  const buff        = Memory.alloc(0x5a8) // magic number from wechat-bot (laozhang)
  const sendMsgAsm  = Memory.alloc(Process.pageSize)

  Memory.patchCode(sendMsgAsm, Process.pageSize, code => {
    var cw = new X86Writer(code, { pc: sendMsgAsm })

    cw.putPushReg('ebp')
    cw.putMovRegReg('ebp', 'esp')
    cw.putPushax()
    cw.putPushfx()

    cw.putPushU32(1)  // push
    cw.putPushU32(0)  // push

    cw.putMovRegRegOffsetPtr('ebx', 'ebp', 0xc) // arg 1
    cw.putPushReg('ebx')  // push

    cw.putMovRegRegOffsetPtr('edx', 'ebp', 0x8) // arg 0
    cw.putMovRegAddress('ecx', buff)

    cw.putCallAddress(moduleBaseAddress.add(
      0x3b56a0
    ))
    cw.putAddRegImm('esp', 0xc)

    cw.putPopfx()
    cw.putPopax()
    cw.putMovRegRegPtr('esp', 'ebp') // Huan(202107): why use RegRegPtr? (RegRet will fail)
    cw.putPopReg('ebp')
    cw.putRet()

    cw.flush()
  })

  const asmNativeFunction = new NativeFunction(sendMsgAsm, 'void', ['pointer', 'pointer'])
  const nativeCallback    = new NativeCallback(sendMsgCallback, 'void', ['pointer', 'pointer'])
  const nativeFunction    = new NativeFunction(nativeCallback, 'void', ['pointer', 'pointer'])

  function sendMsgCallback (
    talkerIdPtr,
    contentPtr,
  ) {
    const talkerId  = talkerIdPtr.readUtf16String()
    const content   = contentPtr.readUtf16String()

    const sizeOfStringStruct = Process.pointerSize * 3 // + 0xd

    // allocate space for the struct
    const talkerIdStruct  = Memory.alloc(sizeOfStringStruct) // returns a NativePointer
    const contentStruct   = Memory.alloc(sizeOfStringStruct) // returns a NativePointer

    talkerIdStruct
    .writePointer(talkerIdPtr).add(0x4)
    .writeU32(talkerId.length).add(0x4)
    .writeU32(talkerId.length * 2)

    contentStruct
    .writePointer(contentPtr).add(0x4)
    .writeU32(content.length).add(0x4)
    .writeU32(content.length * 2)

    asmNativeFunction(talkerIdStruct, contentStruct)
  }

  return nativeFunction
})()

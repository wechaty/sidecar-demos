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
 const agentRecvMsgNativeCallback = new NativeCallback(() => {}, 'void', ['pointer', 'pointer'])
 const agentRecvMsgNativeFunction = new NativeFunction(agentRecvMsgNativeCallback, 'void', ['pointer', 'pointer'])

 Interceptor.attach(
   moduleBaseAddress.add(0x3de6fd),
   {
     onEnter() {
       const addr = this.context.ebp.sub(0xc14)

       const wxidPtr = addr.add(0x40).readPointer()
       const contentPtr = addr.add(0x68).readPointer()

       setImmediate(() => agentRecvMsgNativeFunction(wxidPtr, contentPtr))
     }
 })

 /**
  * @Call: sendMsg -> agentSendMsg
  */
 const buff = Memory.alloc(0x5a8)
 const sendMsgAsm = Memory.alloc(Process.pageSize)

 Memory.patchCode(sendMsgAsm, Process.pageSize, function (code) {
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

 const sendMsgNativeFunction = new NativeFunction(sendMsgAsm, 'void', ['pointer', 'pointer'])

 function agentSendMsg (
   contactId,
   text,
 ) {
   const wxIdBuf = Memory.allocUtf16String(contactId)
   const textBuf = Memory.allocUtf16String(text)

   const sizeOfStringStruct = Process.pointerSize * 3 // + 0xd

   // allocate space for the struct
   const wxIdStruct = Memory.alloc(sizeOfStringStruct) // returns a NativePointer
   const wxTextStruct = Memory.alloc(sizeOfStringStruct) // returns a NativePointer

   wxIdStruct
   .writePointer(wxIdBuf).add(0x4)
   .writeU32(contactId.length).add(0x4)
   .writeU32(contactId.length * 2)

   wxTextStruct
   .writePointer(textBuf).add(0x4)
   .writeU32(text.length).add(0x4)
   .writeU32(text.length * 2)

   sendMsgNativeFunction(wxIdStruct, wxTextStruct)
 }

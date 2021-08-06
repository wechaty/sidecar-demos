/**
 * WeCom 3.1.6.3605
 *  > Special thanks to: 弛云科技
 *
 * Installer: http://dldir1.qq.com/wework/work_weixin/WeCom_3.1.6.3605.exe
 */
const moduleBaseAddress = Module.getBaseAddress('WXWork.exe')

/**
 * Huan(202107)
 *  std::string memory read: size LSB (=1) indicates if it's a long string
 *
 * https://github.com/iddoeldor/frida-snippets#load-cpp-module
 */
function readStdString(str) {
  if ((str.readU8() & 1) === 1) { // size LSB (=1) indicates if it's a long string
    return str.add(2 * Process.pointerSize).readPointer().readUtf8String();
  }
  return str.add(1).readUtf8String()
}

 /**
  * @Hook: recvMsg -> recvMsgNativeCallback
  */
const recvMsgNativeCallback = (() => {
  const nativeCallback      = new NativeCallback(() => {}, 'void', ['pointer', 'pointer'])
  const nativeativeFunction = new NativeFunction(nativeCallback, 'void', ['pointer', 'pointer'])

  Interceptor.attach(
    moduleBaseAddress.add(0x2DD11A0),
    {
      onEnter() {
        const beforeDecrypt = this.context.ebp.add(0x08)
        const afterDecryptInfo = this.context.ebp.add((0x0C))
        // 解密后包内容为protobuf数据
        const pbData = this.context.ebp.add((0x10))

        const pkgSeq = afterDecryptInfo.add(0x28)

        // LOGINQRCODE=0x22  CHECKQRCODE=0x23  RECVMSG=0x3EC/0x10001
        const pkgId = afterDecryptInfo.add(0x2c)

        console.log('beforeDecrypt:', beforeDecrypt)
        console.log('afterDecryptInfo:', afterDecryptInfo)
        console.log('pbData', pbData)
        console.log('pbData Str', readStdStr(pbData).toString(16))
        console.log('pkgSeq:', pkgSeq)
        console.log('pkgId:', pkgId)

        // setImmediate(() => nativeativeFunction(talkerIdPtr, contentPtr))
      }
  })
  return nativeCallback
})()

/**
 * @Call: sendMsg -> agentSendMsg
 */

const sendMsg = () => {
  const moduleBase = Module.getBaseAddress('WXWork.exe')

  // dwEcx = HeapAlloc(GetProcessHeap(), HEAP_ZERO_MEMORY,0x100); //只需申请一次内存  dwEcx 实际占用大小0xF8  不同版本结构大小可能有变
  const dwEcx = Memory.alloc(Process.pageSize)

  // *dwEcx = WXWork.exe + 0x03E792CC
  dwEcx.writePointer(moduleBase.add(0x03E792CC))

  const impl1 = Memory.alloc(Process.pageSize)
  Memory.patchCode(impl1, Process.pageSize, code => {
    const cw = new X86Writer(code, { pc: impl1 })

    // mov esi, dwEcx;
    cw.putMovRegAddress('esi', dwEcx)

    // lea ecx, [esi + 0x10];
    cw.putLeaRegRegOffset('ecx', 'esi', 0x10)

    // call WXWork.exe + 0x1576D70;
    cw.putCallAddress(moduleBase.add(0x1576D70))

    // mov esi, dwEcx;
    cw.putMovRegAddress('esi', dwEcx)

    // lea ecx, [esi + 0x10];
    cw.putLeaRegRegOffset('ecx', 'esi', 0x10)

    // push 0;
    cw.putPushU32(0)

    // call WXWork.exe + 0x15858E0;
    cw.putCallAddress(moduleBase.add(0x15858E0))

    // mov esi, dwEcx;
    cw.putMovRegAddress('esi', dwEcx)

    // lea ecx, [esi + 0x10];
    cw.putLeaRegRegOffset('ecx', 'esi', 0x10)

    // push 0;
    cw.putPushU32(0)

    // call WXWork.exe + 0x1585910;
    cw.putCallAddress(moduleBase.add(0x1585910))

    // mov esi, dwEcx;
    cw.putMovRegAddress('esi', dwEcx)

    // mov [esi + 0x4], 6;
    cw.putMovRegOffsetPtrU32('esi', 0x4, 6)

    // mov [esi + 0x8], 3;
    cw.putMovRegOffsetPtrU32('esi', 0x8, 3)

    // lea eax, [esi + 0x10];
    cw.putLeaRegRegOffset('eax', 'esi', 0x10)

    // mov [esi + 0x1C], eax;
    cw.putMovRegOffsetPtrReg('esi', 0x1c, 'eax')

    // mov [esi + 0x20], esi;
    cw.putMovRegOffsetPtrReg('esi', 0x20, 'esi')

    cw.putRet()
    cw.flush()
  })

  let ins = Instruction.parse(impl1)
  for (let i=0; i<20; i++) {
    console.log(ins.address, '\t', ins.mnemonic, '\t', ins.opStr)
    ins = Instruction.parse(ins.next)
  }

  const impl1NativeFunction = new NativeFunction(impl1, 'void', [])
  impl1NativeFunction()

  // 写入会话id  更换会话对象时修改会话id即可 不必重复前面的步骤
  // 需delete  1688123456789012=自己id  7881234567890123=对方id
  // string *conversation_id = new std::string("S:1688123456789012_7881234567890123");
  const conversationIdPtr = Memory.allocUtf16String('S:1688123456789012_7881234567890123')

  // *(dwEcx + 0x14) = conversation_id; // 写入会话id
  dwEcx.add(0x14).writePointer(conversationIdPtr)

  // ------------------------------------------------------------------------------------------------------------------------------------

  // 构建arg:
  // arg = {
  // 	DWORD addr = 0;
  // 	DWORD base = 0;
  // }
  const argStructPtr = Memory.alloc(0x8)
  argStructPtr
    .writeU32(0).add(0x4)
    .writeU32(0)

  const impl2 = Memory.alloc(Process.pageSize)
  Memory.patchCode(impl2, Process.pageSize, code => {
    const cw = new X86Writer(code, { pc: impl2 })
    // lea ecx, arg;
    cw.putMovRegAddress('ecx', argStructPtr)

    // push ecx;
    cw.putPushReg('ecx')

    // call WXWork.exe + 0x1D6450;
    cw.putCallAddress(moduleBase.add(0x1D6450))

    // add esp, 0x4;
    cw.putAddRegImm('esp', 0x4)

    cw.putRet()
    cw.flush()
  })

  const impl2NativeFunction = new NativeFunction(impl2, 'void', [])
  impl2NativeFunction()

  // pbdata的hex格式: 0A15080012110A0FE5898DE99DA2E79A84E6B688E681AF0A0E0803120A0A085BE5A5B8E7AC915D0A15080012110A0FE4B8ADE997B4E79A84E6B688E681AF0A0E0803120A0A085BE6B581E6B3AA5D
  // string* pbMessage = new string(pbdata);//需delete
  const pbHex = '0A15080012110A0FE5898DE99DA2E79A84E6B688E681AF0A0E0803120A0A085BE5A5B8E7AC915D0A15080012110A0FE4B8ADE997B4E79A84E6B688E681AF0A0E0803120A0A085BE6B581E6B3AA5D'
  const pbPtr = Memory.allocUtf16String(pbHex)

  // *(arg.addr + 0x50) = msgType; //写入发送的消息类型
  // ?? 收包id 0x10001 0x3EC都是消息  拿到protobuf数据之后反序列化一下就能看出来需要的那些字段了
  argStructPtr.add(0x50).writeU32(0x10001)

  // *(arg.addr + 0x134) = pbMessage->c_str();//写入发送消息的内容
  argStructPtr.add(0x134).writePointer(pbPtr)

  // *(arg.addr + 0x144) = pbMessage->size();
  argStructPtr.add(0x144).writeU32(pbHex.length)

  // *(arg.addr + 0x148) = pbMessage->capacity();
  argStructPtr.add(0x148).writeU32(pbHex.length)

  // dwArg = HeapAlloc(GetProcessHeap(), HEAP_ZERO_MEMORY,0x20); //需HeapFree
  const dwArg = Memory.alloc(Process.pageSize)

  // *(dwArg + 0x14) = arg.addr;
  dwArg.add(0x14).readPointer().writePointer(argStructPtr)

  // *(dwArg + 0x18) = arg.base;
  dwArg.add(0x18).readPointer().writePointer(argStructPtr.add(0x4))

  // *(dwArg + 0x8) = dwArg + 0x14;
  dwArg.add(0x8).readPointer().writePointer(dwArg.add(0x14))

  // *(dwArg + 0xC) = dwArg + 0x1C;
  dwArg.add(0xC).readPointer().writePointer(dwArg.add(0x1C))

  // *(dwArg + 0x10) = dwArg + 0x1C;
  dwArg.add(0x10).readPointer().writePointer(dwArg.add(0x1C))

  // -------------------------------------------------------------------------------------------------------------------------------------
  // 调用发送消息call：

  const impl3 = Memory.alloc(Process.pageSize)
  Memory.patchCode(impl3, Process.pageSize, code => {
    const cw = new X86Writer(code, { pc: impl3 })

    // push 1;
    cw.putPushU32(1)

    // push 0;
    cw.putPushU32(0)

    // mov eax, dwArg;
    cw.putMovRegAddress('eax', dwArg)

    // push eax;
    cw.putPushReg('eax')

    // add eax, 0x8;
    cw.putAddRegImm('eax', 0x8)

    // push eax;
    cw.putPushReg('eax')

    // mov ecx, dwEcx;
    cw.putMovRegAddress('ecx', dwEcx)

    // add ecx, 0x10;
    cw.putAddRegImm('ecx', 0x10)

    // call WXWork.exe + 0x1585A90;
    cw.putCallAddress(moduleBase.add(0x1585A90))

    cw.putRet()
    cw.flush()
  })

  const impl3NativeFunction = new NativeFunction(impl3, 'void', [])
  impl3NativeFunction()

  // 发送完消息之后需要delete/HeapFree避免内存泄露
}

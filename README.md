# sidecar-demos

Wechaty community sidecar demos.

[![Sidecar WeChat Win32 X86 3.2.1.121](https://img.shields.io/badge/Sidecar-WeChat%203.2.1.121-brightgreen)](https://github.com/wechaty/sidecar-demos/tree/wechat-win32-x86-3.2.1.121)
[![Sidecar Lib Factorial Linux Library](https://img.shields.io/badge/Sidecar-Library%20.so-brightgreen)](https://github.com/wechaty/sidecar-demos/tree/factorial-linux-x64-library)

[![Powered by Sidecar](https://img.shields.io/badge/Powered%20By-Sidecar-red.svg)](https://github.com/huan/sidecar)

A sidecar can intercepting function calls or messages or events passed between your Node.js application and any instant messaging software components.

## Branches

We are using different branches for different sidecar target application demos:

- [WeChat Sidecar 3.2.1.121](https://github.com/wechaty/sidecar-demos/tree/wechat-win32-x86-3.2.1.121)
- WeCom Sidecar (TBA)
- [.so Sidecar (WIP)](https://github.com/wechaty/sidecar-demos/tree/so-linux-x64-library)

## Requirements

1. Node.js >= 10

## Install

```sh
git clone https://github.com/wechaty/sidecar-demos.git
cd sidecar-demos
npm install
```

## Usage

First, you need to launch the application which you want to attach the sidecar. After your account has been logged in:

```sh
npm start
```

Then your account will be able to reply `dong` automatically when receives a message with text `ding`.

## To-do list

- [ ] WeCom Android
  - [wecom android](https://github.com/edxposedd/wework)
- [ ] WeChat Mac
- [ ] WeCom Windows
  - [3.0.27.2701](https://github.com/smallevilbeast/wxwork_pc_api)

## History

### master

### 0.3 (Jul 17, 2021)

1. [.so Sidecar](https://github.com/wechaty/sidecar-demos/tree/so-linux-x64-library)

### 0.2 (Jun 14, 2021)

1. [WeCom Sidecar 3.1.6.3605](https://github.com/wechaty/sidecar-demos/tree/wechat-win32-x86-3.1.6.3605)

### 0.1 (Jun 13, 2021)

1. [WeChat Sidecar 3.2.1.121](https://github.com/wechaty/sidecar-demos/tree/wechat-win32-x86-3.2.1.121)

### 0.0.1 (Jun 12, 2021)

1. First release
1. Powered by [Sidecar](https://github.com/huan/sidecar)

## Special thanks

1. Thanks to @cixingguangming55555 who is a hacker and chatbot hard core fan. He created and shared [老张学技术](https://github.com/cixingguangming55555/wechat-bot) to the chatbot developers' community which is a great source of knowledge.

## Author

[Huan](https://github.com/huan) [(李卓桓)](http://linkedin.com/in/zixia), Tencent TVP of Chatbot, \<zixia@zixia.net\>

[![Profile of Huan LI (李卓桓) on StackOverflow](https://stackoverflow.com/users/flair/1123955.png)](https://stackoverflow.com/users/1123955/huan)

## Copyright & License

- Code & Docs © 2021-now Huan
- Code released under the Apache-2.0 License
- Docs released under Creative Commons

# wechat-sidecar

A Sidecar Demo for WeChat 3.2.1.121

[![Powered by Sidecar](https://img.shields.io/badge/Powered%20By-Sidecar-red.svg)](https://github.com/huan/sidecar)

## WeChat Sidecar

WeChat Sidecar can intercepting function calls or messages or events passed between your Node.js application and WeChat software components.

## Install

### 1. WeChat Sidecar

```sh
git clone https://github.com/huan/wechat-sidecar.git
cd wechat-sidecar
git checkout wechat-3.2.1.121
npm install
```

### 2. WeChat 3.2.1.121

Download WeChat 3.2.1.121 and install it.

> Here's a [download link (with code: `cscn`)](https://pan.baidu.com/share/init?surl=IHRM2OMvrLyuCz5MRbigGg) for you.

## Usage

First, you need to launch the WeChat and login your account. After your account has been logged in:

```sh
npm start
```

Then your WeChat account will be able to reply `dong` automatically when receives a message with text `ding`.

## History

### master

### 0.0.1 (Jun 12, 2021)

1. First release
1. Powered by [Sidecar](https://github.com/huan/sidecar)

## Special thanks

- [老张学技术](https://github.com/cixingguangming55555/wechat-bot) is a great example of WeChat bot.
- [微信 3.1.0.72 - log messages](https://www.bilibili.com/video/av332292647)

## Author

[Huan](https://github.com/huan) [(李卓桓)](http://linkedin.com/in/zixia), Tencent TVP of Chatbot

[![Profile of Huan LI (李卓桓) on StackOverflow](https://stackoverflow.com/users/flair/1123955.png)](https://stackoverflow.com/users/1123955/huan)

## Copyright & License

- Code & Docs © 2021-now Huan
- Code released under the Apache-2.0 License
- Docs released under Creative Commons

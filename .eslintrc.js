const rules = {
  'no-console': ['error', { allow: ['log', 'warn', 'error'] }],
  'multiline-ternary': 0,
}
const globals = {
  Interceptor: true,
  Memory: true,
  Module: true,
  Process: true,
  NativeFunction: true,
  X86Writer: true,
  ptr: true,
  rpc: true,
  send: true,
  recv: true,
}

module.exports = {
  extends: '@chatie',
  rules,
  globals,
}

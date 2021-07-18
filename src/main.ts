/**
 *   Sidecar - https://github.com/huan/sidecar
 *
 *   @copyright 2021 Huan LI (李卓桓) <https://github.com/huan>
 *
 *   Licensed under the Apache License, Version 2.0 (the "License");
 *   you may not use this file except in compliance with the License.
 *   You may obtain a copy of the License at
 *
 *       http://www.apache.org/licenses/LICENSE-2.0
 *
 *   Unless required by applicable law or agreed to in writing, software
 *   distributed under the License is distributed on an "AS IS" BASIS,
 *   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *   See the License for the specific language governing permissions and
 *   limitations under the License.
 *
 */
import {
  attach,
  detach,
}           from 'frida-sidecar'

import assert from 'assert'

import { DllSidecar } from './dll-sidecar'

async function main () {
  const sidecar = new DllSidecar()

  console.log('Factorial Sidecar starting...')
  await attach(sidecar)
  console.log('Factorial Sidecar started.')

  const result = await sidecar.factorial(3)
  assert(result === 6, 'should get factorial(3) === 6')

  console.log('Factorial Sidecar: factorial(3) =', result)

  const clean = () => detach(sidecar)
  process.on('SIGINT',  clean)
  process.on('SIGTERM', clean)

  await detach(sidecar)
}

main()
  .catch(console.error)

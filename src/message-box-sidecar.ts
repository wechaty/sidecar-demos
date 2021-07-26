/**
 *   Wechaty - https://github.com/wechaty/wechaty
 *
 *   @copyright 2021 Wechaty Contributors <https://github.com/wechaty>
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
  Call,
  exportTarget,
  ParamType,
  Ret,
  RetType,
  Sidecar,
  SidecarBody,
}                         from 'frida-sidecar'

@Sidecar(['c:\\windows\\system32\\notepad.exe'])
class MessageBoxSidecar extends SidecarBody {

  /**
   * https://docs.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-messageboxw
   *
    int MessageBox(
      HWND    hWnd,
      LPCTSTR lpText,
      LPCTSTR lpCaption,
      UINT    uType
    );
 */
  @Call(exportTarget('MessagreBoxW', 'user32.dll'))
  @RetType('int')
  messageBox (
    @ParamType('pointer',)                hWnd:     null,
    @ParamType('pointer', 'Utf16String')  text:     string,
    @ParamType('pointer', 'Utf16String')  caption:  string,
    @ParamType('uint')                    type:     number,
  ): Promise<number> { return Ret(hWnd, text, caption, type) }

}

export { MessageBoxSidecar }

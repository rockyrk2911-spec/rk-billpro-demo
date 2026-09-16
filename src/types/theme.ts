export type ThemeMode =
  | 'Light'
  | 'Dark'
  | 'System'

export type AccentColor =
  | 'Blue'
  | 'Purple'
  | 'Green'
  | 'Orange'

export type ThemeSettings = {
  mode: ThemeMode
  accentColor: AccentColor
  compactSidebar: boolean
  denseTables: boolean
  reducedAnimations: boolean
}
export const themingServiceMock = {
  getThemeList: vi.fn(() => ['saga-blue', 'arya-blue']),
  getThemeName: vi.fn(() => 'saga-blue'),
  setTheme: vi.fn(),
};

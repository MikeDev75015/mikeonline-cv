export const alertServiceMock = {
  displayAlertDialog: vi.fn(),
  displayConfirmDialog: () => Promise.resolve(''),
};

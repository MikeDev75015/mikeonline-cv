export const alertServiceMock = {
  displayAlertDialog: jest.fn(),
  displayConfirmDialog: () => Promise.resolve(''),
};

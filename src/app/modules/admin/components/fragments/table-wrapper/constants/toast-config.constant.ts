export const DEFAULT_TOAST_MESSAGES: {
  invalidFormFields: string;
  onDialogSaveAction: TableActions;
  onDuplicateRow: ToastMessages;
  onDeleteRow: ToastMessages;
  onDeleteSelectedRows: ToastMessages;
  onSaveChangedData: ToastMessages;
  onExportSelectedData: ToastMessages;
  onResetTableChanges: ToastMessages;
  sendRequest: ToastMessages;
} = {
  invalidFormFields: 'Configuration des champs du formulaire non valide !',
  onDialogSaveAction: {
    create: {
      success: 'Elément créé avec succès !',
      error: 'Elément non créé !',
    },
    update: {
      success: 'Elément mis à jour avec succès !',
      error: 'Elément non mis à jour !',
    },
  } as TableActions,
  onDuplicateRow: {
    info: 'Elément dupliqué avec succès !',
    error: 'Elément non dupliqué !',
  } as ToastMessages,
  onDeleteRow: {
    error: 'Elément non supprimé !',
    success: 'Elément bien supprimé !',
  } as ToastMessages,
  onDeleteSelectedRows: {
    error: 'Eléments non supprimés !',
    success: 'Eléments supprimés avec succès !',
  } as ToastMessages,
  onSaveChangedData: {
    error: 'Eléments non traités !',
    success: 'Eléments traités avec succès !',
    warn: 'Certains éléments n\'ont pu être traités...',
  } as ToastMessages,
  onExportSelectedData: {
    warn: 'Sélectionner les lignes à exporter...',
    info: 'Les lignes sélectionnées ont bien été exportées.',
    error: 'Les lignes sélectionnées n\'ont pas pu être exportées.',
  } as ToastMessages,
  onResetTableChanges: {
    info: 'Les données ont bien été réinitialisées.',
    error: 'Les données n\'ont pas pu être réinitialisées.',
  } as ToastMessages,
  sendRequest: {
    error: 'Aucune réponse du serveur... L\'opération a échoué !',
  } as ToastMessages,
};

export const DEFAULT_TOAST_CONFIRMATIONS: {
  onDeleteRow: ToastConfirmation,
  onDeleteSelectedRows: ToastConfirmation,
} = {
  onDeleteRow: {
    message: 'Supprimer cet élément ?',
    header: 'Confirmation',
    icon: 'pi pi-exclamation-triangle',
  },
  onDeleteSelectedRows: {
    message: 'Supprimer les {{length}} éléments sélectionnés ?',
    header: 'Confirmation',
    icon: 'pi pi-exclamation-triangle',
  },
};

interface TableActions {
  create: ToastMessages;

  update: ToastMessages;

  delete: ToastMessages;

  duplicate: ToastMessages;

  export: ToastMessages;
}

interface ToastMessages {
  info: string;

  success: string;

  warn: string;

  error: string;
}

interface ToastConfirmation {
  message: string;

  header: string;

  icon: string;
}

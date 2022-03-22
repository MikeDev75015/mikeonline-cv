export const PDF_CV_CREDITS = {
  title: 'Développeur FullStack TS - CV',
  author: 'Mickaël NODANCHE',
  subject: 'Fichier généré depuis mon cv en ligne',
  keywords: 'nodanche mikeonline cv online developper pdf'
};

export const PDF_DEFAULT_HEADER = {
  text: window.location.origin,
  style: 'header'
};

export const PDF_DEFAULT_FOOTER = (currentPage: number, pageCount: number) => ({
  text: `${currentPage.toString()} / ${pageCount}`,
  style: 'footer'
});

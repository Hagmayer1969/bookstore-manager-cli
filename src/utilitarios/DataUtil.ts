/**
 * Converte um texto no formato YYYY-MM-DD para Date.
 * Lanca Error quando o texto nao representa uma data valida.
 */
export function converterStringParaDate(dataStr: string): Date {
  if (!dataStr || dataStr.trim() === '') {
    throw new Error('Data eh obrigatoria');
  }

  const partes = dataStr.trim().split('-');
  if (partes.length !== 3) {
    throw new Error('Data deve estar no formato YYYY-MM-DD (exemplo: 2026-07-15)');
  }

  const ano = Number(partes[0]);
  const mes = Number(partes[1]);
  const dia = Number(partes[2]);

  // new Date(ano, mes, dia) transborda em vez de rejeitar: mes 13 vira janeiro
  // do ano seguinte. Conferir as partes de volta descarta essas datas.
  const dataObj = new Date(ano, mes - 1, dia);
  if (
    dataObj.getFullYear() !== ano ||
    dataObj.getMonth() !== mes - 1 ||
    dataObj.getDate() !== dia
  ) {
    throw new Error('Data invalida');
  }

  return dataObj;
}

export function formatarDataParaExibicao(data: Date): string {
  const dia = String(data.getDate()).padStart(2, '0');
  const mes = String(data.getMonth() + 1).padStart(2, '0');
  const ano = data.getFullYear();
  return `${dia}/${mes}/${ano}`;
}

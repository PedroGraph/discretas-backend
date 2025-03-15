export const currencyFormat = (number) => {
    const format = new Intl.NumberFormat('co-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(number);
    return format.replace("COP", "").trim();
  };
  
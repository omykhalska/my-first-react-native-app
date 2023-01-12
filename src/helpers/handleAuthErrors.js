export const handleAuthErrors = error => {
  const errorCode = error.code;
  const errorMessage = error.message;
  switch (errorCode) {
    case 'auth/weak-password':
      alert('Слишком слабый пароль');
      break;
    case 'auth/email-already-in-use':
      alert('Аккаунт с таким электронным адресом уже зарегистрирован');
      break;
    case 'auth/invalid-email':
      alert('Невалидный электронный адрес');
      break;
    case 'auth/user-not-found':
      alert('Пользователь не найден');
      break;
    case 'auth/wrong-password':
      alert('Неправильный пароль');
      break;
    default:
      alert(errorMessage);
  }
  console.log(error);
};

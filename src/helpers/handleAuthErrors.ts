export const handleAuthErrors = error => {
  const errorCode = error.code;
  const errorMessage = error.message;
  switch (errorCode) {
    case 'auth/weak-password':
      alert('The password is too weak');
      break;
    case 'auth/email-already-in-use':
      alert('An account with this email address is already registered');
      break;
    case 'auth/invalid-email':
      alert('Invalid e-mail address');
      break;
    case 'auth/user-not-found':
      alert('No user was found');
      break;
    case 'auth/wrong-password':
      alert('Wrong password');
      break;
    default:
      alert(errorMessage);
  }
  console.log(error);
};

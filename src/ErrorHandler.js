import Swal from 'sweetalert2'

const HandleError = (error, title = "Error", text = "An unexpected error occurred") => {
    const showAlert = (icon, title, text, timer = 3000) => {
        Swal.fire({
            icon,
            title,
            text,
            showConfirmButton: false,
            timer,
        });
    };

    if (error?.response?.data?.status === 403) {
        showAlert('error', 'Authentication error! Unauthorized', 'You will be logged out');
        localStorage.clear();
        return;
    }

    if (!error && text) {
        showAlert('error', title, text);
        return;
    }

    const errorMessage = error?.response?.data || "An unknown error occurred";
    showAlert('error', title, errorMessage);
};


export default HandleError
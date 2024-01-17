import axios from 'axios';
import { SeverityOptions } from '../components/Snackbar/SnackbarContextProvider';

export default async function deleteArticle(
  postID: number,
  openSnackbar: (severity: SeverityOptions, message: string) => void,
  handleClose?: () => void,
  onDelete?: (id: number) => void
) {
  try {
    await axios.delete(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}api/newsarticles/${postID}`
    );
    if (handleClose) {
      handleClose();
    }

    if (onDelete) {
      onDelete(postID);
    }

    openSnackbar('success', 'The article was deleted');
  } catch (err) {
    if (handleClose) {
      handleClose();
    }

    openSnackbar('error', 'There was an error');
  }
}

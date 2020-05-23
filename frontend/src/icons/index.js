
import { library } from '@fortawesome/fontawesome-svg-core'
import {
    faComment, faEdit, faExclamationCircle, faSpinner, faTimes
} from '@fortawesome/free-solid-svg-icons'

// Add more icons here when required

export default function setupIcons() {
    library.add(
        faComment,
        faEdit,
        faExclamationCircle,
        faSpinner,
        faTimes
    );
}


import { library } from '@fortawesome/fontawesome-svg-core'
import {
    faComment, faEdit, faExclamationCircle, faTimes
} from '@fortawesome/free-solid-svg-icons'

// Add more icons here when required

export default function setupIcons() {
    library.add(
        faComment,
        faEdit,
        faExclamationCircle,
        faTimes
    );
}

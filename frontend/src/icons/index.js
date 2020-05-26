
import { library } from '@fortawesome/fontawesome-svg-core'
import {
    faPlus,
    faArrowDown,
    faArrowUp,
    faComment,
    faEdit,
    faExclamationCircle,
    faChevronLeft,
    faChevronRight,
    faSpinner,
    faTimes
} from '@fortawesome/free-solid-svg-icons'

// Add more icons here when required

export default function setupIcons() {
    library.add(
        faPlus,
        faArrowDown,
        faArrowUp,
        faComment,
        faEdit,
        faExclamationCircle,
        faChevronLeft,
        faChevronRight,
        faSpinner,
        faTimes
    );
}

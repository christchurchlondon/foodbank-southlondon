
import { library } from '@fortawesome/fontawesome-svg-core'
import {
    faPlus,
    faArrowDown,
    faArrowUp,
    faChevronLeft,
    faChevronRight,
    faComment,
    faEdit,
    faExclamationCircle,
    faSignOutAlt,
    faSpinner,
    faTimes,
    faUser
} from '@fortawesome/free-solid-svg-icons'

// Add more icons here when required

export default function setupIcons() {
    library.add(
        faPlus,
        faArrowDown,
        faArrowUp,
        faChevronLeft,
        faChevronRight,
        faComment,
        faEdit,
        faExclamationCircle,
        faSignOutAlt,
        faSpinner,
        faTimes,
        faUser
    );
}

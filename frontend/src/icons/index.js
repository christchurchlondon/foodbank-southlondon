
import { library } from '@fortawesome/fontawesome-svg-core'
import {
    faPlus,
    faArrowDown,
    faArrowUp,
    faChevronDown,
    faChevronLeft,
    faChevronRight,
    faChevronUp,
    faComment,
    faEdit,
    faExclamationCircle,
    faSearch,
    faSignOutAlt,
    faSpinner,
    faTimes,
    faUser
} from '@fortawesome/free-solid-svg-icons'
import {
    faSave
} from '@fortawesome/free-regular-svg-icons'

// Add more icons here when required

export default function setupIcons() {
    
    // Solid icons
    library.add(
        faPlus,
        faArrowDown,
        faArrowUp,
        faChevronDown,
        faChevronLeft,
        faChevronRight,
        faChevronUp,
        faComment,
        faEdit,
        faExclamationCircle,
        faSearch,
        faSignOutAlt,
        faSpinner,
        faTimes,
        faUser
    );

    // Regular icons
    library.add(
        faSave
    );

}

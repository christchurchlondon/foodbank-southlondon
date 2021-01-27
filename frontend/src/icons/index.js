
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
    faFlag,
    faSearch,
    faSignOutAlt,
    faSpinner,
    faTimes,
    faUser,
    faBars,
    faSync
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
        faFlag,
        faSearch,
        faSignOutAlt,
        faSpinner,
        faTimes,
        faUser,
        faBars,
        faSync
    );

    // Regular icons
    library.add(
        faSave
    );

}

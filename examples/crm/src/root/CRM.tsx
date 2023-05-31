import {
    Admin,
    CustomRoutes,
    ListGuesser,
    RaThemeOptions,
    Resource,
    defaultTheme,
    localStorageStore,
} from 'react-admin';

import { Route } from 'react-router';
import Layout from '../Layout';
import { authProvider } from '../authProvider';
import companies from '../companies';
import contacts from '../contacts';
import { Dashboard } from '../dashboard/Dashboard';
import { dataProvider } from '../dataProvider';
import deals from '../deals';
import { LoginPage } from '../login/LoginPage';
import { SignupPage } from '../login/SignupPage';
import { SettingsPage } from '../settings/SettingsPage';
import {
    ConfigurationContextValue,
    ConfigurationProvider,
} from './ConfigurationContext';
import {
    defaultCompanySectors,
    defaultContactGender,
    defaultDealCategories,
    defaultDealPipelineStatuses,
    defaultDealStages,
    defaultLogo,
    defaultNoteStatuses,
    defaultTaskTypes,
    defaultTitle,
} from './defaultConfiguration';
import sales from '../sales';
import { deepmerge } from '@mui/utils';

// Define the interface for the CRM component props
type CRMProps = {
    lightTheme?: RaThemeOptions;
    darkTheme?: RaThemeOptions;
} & Partial<ConfigurationContextValue>;

// const defaultLightTheme = {
//     ...defaultTheme,
//     palette: {
//         background: {
//             default: '#fafafb',
//         },
//     },
//     components: {
//         RaFileInput: {
//             styleOverrides: {
//                 root: {
//                     '& .RaFileInput-dropZone': {
//                         backgroundColor: 'MistyRose',
//                     },
//                 },
//             },
//         },
//     },
// };

const defaultLightTheme = deepmerge(defaultTheme, {
    palette: {
        background: {
            default: '#fafafb',
        },
    },
    components: {
        RaFileInput: {
            styleOverrides: {
                root: {
                    '& .RaFileInput-dropZone': {
                        backgroundColor: 'rgba(0, 0, 0, 0.04)',
                    },
                },
            },
        },
    },
});

/**
 * CRM Component
 *
 * This component sets up and renders the main CRM application using `react-admin`. It provides
 * default configurations and themes but allows for customization through props. The component
 * wraps the application with a `ConfigurationProvider` to provide configuration values via context.
 *
 * @param {Array<ContactGender>} contactGender - The gender options for contacts used in the application.
 * @param {string[]} companySectors - The list of company sectors used in the application.
 * @param {RaThemeOptions} darkTheme - The theme to use when the application is in dark mode.
 * @param {string[]} dealCategories - The categories of deals used in the application.
 * @param {string[]} dealPipelineStatuses - The statuses of deals in the pipeline used in the application.
 * @param {DealStage[]} dealStages - The stages of deals used in the application.
 * @param {RaThemeOptions} lightTheme - The theme to use when the application is in light mode.
 * @param {string} logo - The logo used in the CRM application.
 * @param {NoteStatus[]} noteStatuses - The statuses of notes used in the application.
 * @param {string[]} taskTypes - The types of tasks used in the application.
 * @param {string} title - The title of the CRM application.
 *
 * @returns {JSX.Element} The rendered CRM application.
 *
 * @example
 * // Basic usage of the CRM component
 * import { CRM } from './CRM';
 *
 * const App = () => (
 *     <CRM
 *         logo="/path/to/logo.png"
 *         title="My Custom CRM"
 *         lightTheme={{
 *             ...defaultTheme,
 *             palette: {
 *                 primary: { main: '#0000ff' },
 *             },
 *         }}
 *     />
 * );
 *
 * export default App;
 */
export const CRM = ({
    contactGender = defaultContactGender,
    companySectors = defaultCompanySectors,
    darkTheme,
    dealCategories = defaultDealCategories,
    dealPipelineStatuses = defaultDealPipelineStatuses,
    dealStages = defaultDealStages,
    lightTheme = defaultLightTheme,
    logo = defaultLogo,
    noteStatuses = defaultNoteStatuses,
    taskTypes = defaultTaskTypes,
    title = defaultTitle,
}: CRMProps) => (
    <ConfigurationProvider
        contactGender={contactGender}
        companySectors={companySectors}
        dealCategories={dealCategories}
        dealPipelineStatuses={dealPipelineStatuses}
        dealStages={dealStages}
        logo={logo}
        noteStatuses={noteStatuses}
        taskTypes={taskTypes}
        title={title}
    >
        <Admin
            dataProvider={dataProvider}
            authProvider={authProvider}
            store={localStorageStore(undefined, 'CRM')}
            layout={Layout}
            loginPage={LoginPage}
            dashboard={Dashboard}
            theme={lightTheme}
            darkTheme={darkTheme || null}
        >
            {permissions => (
                <>
                    <CustomRoutes noLayout>
                        <Route
                            path={SignupPage.path}
                            element={<SignupPage />}
                        />
                    </CustomRoutes>
                    <CustomRoutes>
                        <Route
                            path={SettingsPage.path}
                            element={<SettingsPage />}
                        />
                    </CustomRoutes>
                    <Resource name="deals" {...deals} />
                    <Resource name="contacts" {...contacts} />
                    <Resource name="companies" {...companies} />
                    <Resource name="contactNotes" />
                    <Resource name="dealNotes" />
                    <Resource name="tasks" list={ListGuesser} />
                    {permissions === 'admin' ? (
                        <Resource name="sales" {...sales} />
                    ) : null}
                    <Resource name="tags" list={ListGuesser} />
                </>
            )}
        </Admin>
    </ConfigurationProvider>
);

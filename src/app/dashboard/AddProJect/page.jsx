import { CONFIG } from 'src/config-global';

import { AddProject } from 'src/sections/task-tracker/AddP/add-project';

// ----------------------------------------------------------------------

export const metadata = { title: `Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  return <AddProject />;
}

import { CONFIG } from 'src/config-global';

import { TrackerView } from 'src/sections/task-tracker';

// ----------------------------------------------------------------------

export const metadata = { title: `Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  return <TrackerView />;
}

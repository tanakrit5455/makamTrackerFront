import { CONFIG } from 'src/config-global';

import { TimelineView } from 'src/sections/task-tracker-timeline';

// ----------------------------------------------------------------------

export const metadata = { title: `Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  return <TimelineView />;
}

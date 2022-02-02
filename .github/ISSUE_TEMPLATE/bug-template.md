---
name: Bug template
about: Create a report to help us improve
title: 'BUG:'
labels: 'bug'
assignees: ''

---

**Describe your issue**:
Describe your issue here...

**The code of the library usage**:

```javascript
import { prepareEnvironment } from '@gmrchk/cli-testing-library';

it('program', async () => {
    const { cleanup, path } = await prepareEnvironment();
    
    // your test...
    
    await cleanup();
});
```

**Before creating this issue, did you think of...**:
- [ ] Have you checked closed issues for similar/related problems?
- [ ] Have you provided all helpful information available?
- [ ] Have you considered creating a demo repository, or a link to your running project where the problem is reproducible?

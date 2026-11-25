/** @jest-environment jsdom */
import { isAutomaticMergeNotice, QUIET_MERGE_ATTRIBUTE, silenceMergeNotices } from './QuietMergeNotices';

const merge = '"My note.md" has been modified externally, merging changes automatically.';
const flush = () => new Promise<void>((resolve) => setTimeout(resolve, 0));

test('matches the automatic-merge notice, not failures or unrelated notices', () => {
  expect(isAutomaticMergeNotice(merge)).toBe(true);
  expect(isAutomaticMergeNotice('"Folder/日記.md" has been modified externally,\nmerging changes automatically')).toBe(true);
  expect(isAutomaticMergeNotice('Failed to merge changes automatically.')).toBe(false);
  expect(isAutomaticMergeNotice('Update time on edit failed\nMalformed frontmatter')).toBe(false);
  expect(isAutomaticMergeNotice('Sync conflict detected')).toBe(false);
});

test('filters inserted and updated notices, restores reused messages and unloads cleanly', async () => {
  document.body.innerHTML = '<div class="notice">Sync connected</div>';
  const dispose = silenceMergeNotices(document);
  const notice = document.createElement('div');
  notice.className = 'notice';
  notice.innerHTML = '<span></span>';
  document.body.appendChild(notice);
  notice.firstChild!.textContent = merge;
  await flush();
  expect(notice.getAttribute(QUIET_MERGE_ATTRIBUTE)).toBe('true');
  expect(document.body.firstElementChild!.hasAttribute(QUIET_MERGE_ATTRIBUTE)).toBe(false);
  notice.textContent = 'Failed to save note';
  await flush();
  expect(notice.hasAttribute(QUIET_MERGE_ATTRIBUTE)).toBe(false);
  notice.textContent = merge;
  await flush();
  expect(notice.hasAttribute(QUIET_MERGE_ATTRIBUTE)).toBe(true);
  dispose();
  expect(notice.hasAttribute(QUIET_MERGE_ATTRIBUTE)).toBe(false);
  notice.textContent = merge + ' ';
  await flush();
  expect(notice.hasAttribute(QUIET_MERGE_ATTRIBUTE)).toBe(false);
});

test('handles existing notices and a separate window document', () => {
  const iframe = document.createElement('iframe');
  document.body.appendChild(iframe);
  const other = iframe.contentDocument!;
  other.body.innerHTML = '<div class="notice"></div>';
  other.body.firstElementChild!.textContent = merge;
  const dispose = silenceMergeNotices(other);
  expect(other.body.firstElementChild!.getAttribute(QUIET_MERGE_ATTRIBUTE)).toBe('true');
  dispose();
  iframe.remove();
});

/* Run through Obsidian CLI eval, against the installed fork. */
(async () => {
  const proof = {};
  const merge = document.createElement('div');
  merge.className = 'notice';
  merge.textContent = '"Quiet fork verification.md" has been modified externally, merging changes automatically.';
  const other = document.createElement('div');
  other.className = 'notice';
  other.textContent = 'Quiet fork verification: unrelated notice';
  document.body.append(merge, other);
  try {
    await Promise.resolve();
    proof.mergeNoticeHidden = getComputedStyle(merge).display === 'none';
    proof.otherNoticeVisible = getComputedStyle(other).display !== 'none';
    merge.textContent = 'Quiet fork verification: save failure simulation';
    await Promise.resolve();
    proof.reusedNoticeRestored = getComputedStyle(merge).display !== 'none';
  } finally {
    merge.remove();
    other.remove();
  }
  const path = 'Codex-quiet-fork-verification-' + crypto.randomUUID() + '.md';
  const body = 'Temporary verification of timestamp updates.\n';
  let file;
  try {
    file = await app.vault.create(path, body);
    await app.vault.modify(file, body + 'Verified content must remain intact.\n');
    await new Promise((resolve) => setTimeout(resolve, 1800));
    const content = await app.vault.read(file);
    proof.createdTimestampPresent = /^created: /m.test(content);
    proof.updatedTimestampPresent = /^updated: /m.test(content);
    proof.noteBodyIntact = content.endsWith(body + 'Verified content must remain intact.\n');
  } finally {
    if (file && app.vault.getAbstractFileByPath(path) === file) await app.vault.delete(file, true);
  }
  proof.temporaryNoteRemoved = !app.vault.getAbstractFileByPath(path);
  proof.quietLoaded = !!app.plugins.plugins['update-time-on-edit-quiet'];
  proof.originalLoaded = !!app.plugins.plugins['update-time-on-edit'];
  return JSON.stringify(proof);
})()

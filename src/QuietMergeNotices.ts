/** Match only Obsidian's successful automatic-merge notice, including filenames. */
export function isAutomaticMergeNotice(text: string): boolean {
  return /^.+ has been modified externally, merging changes automatically\.?$/.test(
    text.replace(/\s+/g, ' ').trim(),
  );
}

export const QUIET_MERGE_ATTRIBUTE = 'data-update-time-quiet-merge';

/** Runs before painting, without changing Notice or the editor's merge behavior. */
export function silenceMergeNotices(doc: Document): () => void {
  const hidden = new Set<Element>();
  const inspectNotice = (notice: Element) => {
    const matches = isAutomaticMergeNotice(notice.textContent || '');
    if (matches) {
      notice.setAttribute(QUIET_MERGE_ATTRIBUTE, 'true');
      hidden.add(notice);
    } else if (hidden.delete(notice)) {
      // Notice.setMessage may reuse an existing notice for a different message.
      notice.removeAttribute(QUIET_MERGE_ATTRIBUTE);
    }
  };
  const inspectNode = (node: Node, descendants = true) => {
    const element = node.nodeType === 1 ? node as Element : node.parentElement;
    if (!element) return;
    const parentNotice = element.closest('.notice');
    if (parentNotice) inspectNotice(parentNotice);
    if (descendants) element.querySelectorAll('.notice').forEach(inspectNotice);
  };
  const Observer = doc.defaultView?.MutationObserver;
  if (!Observer || !doc.body) return () => {};
  const observer = new Observer((records) => {
    for (const record of records) {
      inspectNode(record.target, false);
      record.addedNodes.forEach((node) => inspectNode(node));
    }
    // Do not retain notices after Obsidian removes them.
    hidden.forEach((notice) => {
      if (!notice.isConnected) hidden.delete(notice);
    });
  });
  observer.observe(doc.body, { childList: true, characterData: true, subtree: true });
  doc.querySelectorAll('.notice').forEach(inspectNotice);
  return () => {
    observer.disconnect();
    hidden.forEach((notice) => notice.removeAttribute(QUIET_MERGE_ATTRIBUTE));
    hidden.clear();
  };
}

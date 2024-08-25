<script lang="ts">
  const rebase = (image: string): void => window.electron.ipcRenderer.send('rebase', image)
  const reboot = (): void => window.electron.ipcRenderer.send('reboot')

  let rebaseStatus: 'unstarted' | 'rebasing' | 'done' = 'unstarted'
  // @ts-ignore (this api comes from preload/index.ts but the type doesn't seem to be available here)
  window.api.onRebaseStatusChange((value) => {
    rebaseStatus = value
  })

  let log = ''
  // @ts-ignore (this api comes from preload/index.ts but the type doesn't seem to be available here)
  window.api.onRebaseLogUpdate((value) => {
    log += value + '\n'
  })

  const config = (window as unknown as { config: { image: string } }).config
</script>

<button class="rebaseButton" on:click={() => rebase(config.image)}> Rebase </button>
<button class="rebaseButton" on:click={reboot}> Reboot </button>
<div>{rebaseStatus}</div>
<pre>{log}</pre>

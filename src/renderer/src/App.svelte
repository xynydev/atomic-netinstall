<script lang="ts">
  const rebase = (): void => window.electron.ipcRenderer.send('rebase')
  const reboot = (): void => window.electron.ipcRenderer.send('reboot')
</script>

<button class="rebaseButton" on:click={rebase}> Rebase </button>
<button class="rebaseButton" on:click={reboot}> Reboot </button>

import { MenuPrincipal } from './menus/menuPrincipal';

async function main(): Promise<void> {
  const menu = new MenuPrincipal();
  await menu.executar();
}

main().catch((erro) => {
  console.error('Erro na aplicacao:', erro);
  process.exit(1);
});
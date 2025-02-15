import { h, Hooks } from 'snabbdom';
import { spinnerVdom as spinner } from 'common/spinner';
import { bind } from 'common/snabbdom';
import LobbyController from '../ctrl';

function renderRange(range: string) {
  return h('div.range', range.replace('-', '–'));
}

export function hooks(ctrl: LobbyController): Hooks {
  return bind(
    'click',
    e => {
      const id =
        (e.target as HTMLElement).getAttribute('data-id') ||
        ((e.target as HTMLElement).parentNode as HTMLElement).getAttribute('data-id');
      if (id === 'custom') ctrl.setupCtrl.openModal('hook');
      else if (id) ctrl.clickPool(id);
    },
    ctrl.redraw
  );
}

export function render(ctrl: LobbyController) {
  const member = ctrl.poolMember;
  return ctrl.pools
    .map(pool => {
      const active = !!member && member.id === pool.id,
        transp = !!member && !active;
      return h(
        'div',
        {
          class: {
            active,
            transp: !active && transp,
          },
          attrs: { 'data-id': pool.id },
        },
        [
          h('div.clock', pool.lim + '+' + pool.inc),
          active && member!.range && ctrl.opts.showRatings ? renderRange(member!.range!) : h('div.perf', pool.perf),
          active ? spinner() : null,
        ]
      );
    })
    .concat(
      h(
        'div.custom',
        {
          class: { transp: !!member },
          attrs: { 'data-id': 'custom' },
        },
        ctrl.trans.noarg('custom')
      )
    );
}

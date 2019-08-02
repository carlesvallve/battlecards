import animate from 'animate';
import View from 'ui/View';
import BitmapFontTextView from 'ui/bitmapFont/BitmapFontTextView';
import bitmapFonts from 'src/lib/bitmapFonts';

export const animDuration: number = 250;

export const animateDefault = (
  view: View,
  opts: { y: number; mode: 'in' | 'out' },
) => {
  const d = 16;
  if (opts.mode === 'in') {
    view.updateOpts({ y: opts.y + d, opacity: 0 });
    animate(view)
      .clear()
      .then({ y: opts.y, opacity: 1 }, animDuration, animate.easeOut);
  } else {
    animate(view)
      .clear()
      .then({ y: opts.y + d, opacity: 0 }, animDuration, animate.easeOut);
  }
};

export default {
  // text
  bitmapFontText: {
    align: 'center',
    verticalAlign: 'center',
    size: 30,
    color: 'white',
    wordWrap: false,
  },

  // hud

  buttonMenu: {
    image: 'resources/images/ui/buttons/btn_menu.png',
    imagePressed: 'resources/images/ui/buttons/btn_menu_down.png',
    imageDisabled: 'resources/images/ui/buttons/btn_menu.png',
    scaleMethod: '9slice',
    sourceSlices: {
      horizontal: { left: 22, right: 22 },
      vertical: { top: 22, bottom: 22 },
    },
    pressedOffsetY: 7,
  },

  buttonCoinFrame: {
    image: 'resources/images/ui/buttons/frame_hud_coins_bg.png',
    imagePressed: 'resources/images/ui/buttons/frame_hud_coins_bg.png',
    imageDisabled: 'resources/images/ui/buttons/frame_hud_coins_bg.png',
    scaleMethod: '9slice',
    sourceSlices: {
      horizontal: { left: 18, right: 18 },
      vertical: { top: 18, bottom: 18 },
    },
    pressedOffsetY: 0,
  },

  buttonCoinPlus: {
    image: 'resources/images/ui/buttons/btn_hud_plus.png',
    imagePressed: 'resources/images/ui/buttons/btn_hud_plus_down.png',
    imageDisabled: 'resources/images/ui/buttons/btn_hud_plus.png',
    scaleMethod: '9slice',
    sourceSlices: {
      horizontal: { left: 22, right: 22 },
      vertical: { top: 22, bottom: 22 },
    },
    pressedOffsetY: 7,
  },

  // social buttons

  buttonFacebook: {
    image: 'resources/images/ui/buttons/btn_fb_share.png',
    imagePressed: 'resources/images/ui/buttons/btn_fb_share_down.png',
    imageDisabled: 'resources/images/ui/buttons/btn_fb_share.png',
    scaleMethod: '9slice',
    sourceSlices: {
      horizontal: { left: 72, right: 22 },
      vertical: { top: 22, bottom: 22 },
    },
    pressedOffsetY: 7,
    labelOffsetX: 26,
  },

  buttonMessenger: {
    image: 'resources/images/ui/buttons/btn_messenger_share.png',
    imagePressed: 'resources/images/ui/buttons/btn_messenger_share_down.png',
    imageDisabled: 'resources/images/ui/buttons/btn_messenger_share.png',
    scaleMethod: '9slice',
    sourceSlices: {
      horizontal: { left: 72, right: 22 },
      vertical: { top: 22, bottom: 22 },
    },
    pressedOffsetY: 7,
    labelOffsetX: 30,
  },

  // slot machine buttons

  buttonSpin: {
    image: 'resources/images/ui/slotmachine/slotmachine-button_spin_up.png',
    imagePressed:
      'resources/images/ui/slotmachine/slotmachine-button_spin_down.png',
    imageStop: 'resources/images/ui/slotmachine/slotmachine-button_stop.png',
    pressedOffsetY: 2,
  },

  buttonPurple: {
    image: 'resources/images/ui/slotmachine/slotmachine-button_purple_up.png',
    imagePressed:
      'resources/images/ui/slotmachine/slotmachine-button_purple_down.png',
    imageDisabled:
      'resources/images/ui/slotmachine/slotmachine-button_grey_up.png',
    pressedOffsetY: 2,
  },

  buttonBets: {
    image: 'resources/images/ui/slotmachine/slotmachine-button_bet_up.png',
    imagePressed:
      'resources/images/ui/slotmachine/slotmachine-button_bet_down.png',
    pressedOffsetY: 2,
  },

  // general buttons

  buttonBlue: {
    image: 'resources/images/ui/buttons/btn_blue.png',
    imagePressed: 'resources/images/ui/buttons/btn_blue_down.png',
    imageDisabled: 'resources/images/ui/buttons/btn_blue.png',
    scaleMethod: '9slice',
    sourceSlices: {
      horizontal: { left: 22, right: 22 },
      vertical: { top: 22, bottom: 22 },
    },
    pressedOffsetY: 7,
  },

  buttonGreen: {
    image: 'resources/images/ui/buttons/btn_green.png',
    imagePressed: 'resources/images/ui/buttons/btn_green_down.png',
    imageDisabled: 'resources/images/ui/buttons/btn_green.png',
    scaleMethod: '9slice',
    sourceSlices: {
      horizontal: { left: 22, right: 22 },
      vertical: { top: 22, bottom: 22 },
    },
    pressedOffsetY: 7,
  },

  buttonRed: {
    image: 'resources/images/ui/buttons/btn_red.png',
    imagePressed: 'resources/images/ui/buttons/btn_red_down.png',
    imageDisabled: 'resources/images/ui/buttons/btn_red.png',
    scaleMethod: '9slice',
    sourceSlices: {
      horizontal: { left: 22, right: 22 },
      vertical: { top: 22, bottom: 22 },
    },
    pressedOffsetY: 7,
  },

  buttonTeal: {
    image: 'resources/images/ui/buttons/btn_teal.png',
    imagePressed: 'resources/images/ui/buttons/btn_teal_down.png',
    imageDisabled: 'resources/images/ui/buttons/btn_teal.png',
    scaleMethod: '9slice',
    sourceSlices: {
      horizontal: { left: 22, right: 22 },
      vertical: { top: 22, bottom: 22 },
    },
    pressedOffsetY: 7,
  },

  buttonGrey: {
    image: 'resources/images/ui/buttons/btn_grey_down.png',
    imagePressed: 'resources/images/ui/buttons/btn_grey_down.png',
    imageDisabled: 'resources/images/ui/buttons/btn_grey_down.png',
    scaleMethod: '9slice',
    sourceSlices: {
      horizontal: { left: 22, right: 22 },
      vertical: { top: 22, bottom: 22 },
    },
    pressedOffsetY: 0,
  },

  // dropdown combo box

  buttonDropdown: {
    image: 'resources/images/ui/buttons/popup-settings_btn_dropdown.png',
    imagePressed: 'resources/images/ui/buttons/popup-settings_btn_dropdown.png',
    imageDisabled:
      'resources/images/ui/buttons/popup-settings_btn_dropdown.png',
    scaleMethod: '9slice',
    sourceSlices: {
      horizontal: { left: 18, right: 18 },
      vertical: { top: 18, bottom: 18 },
    },
    pressedOffsetY: 0,
  },

  buttonText: {
    image: '',
    imagePressed: '',
    imageDisabled: '',
    scaleMethod: '9slice',
    sourceSlices: {
      horizontal: { left: 18, right: 18 },
      vertical: { top: 18, bottom: 18 },
    },
    pressedOffsetY: 0,
  },
};

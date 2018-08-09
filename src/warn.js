// @flow

const DEV_MODE = /http:\/\/localhost/.test(window.location.href);

function warn(ex: any) {
  if (DEV_MODE) {
    console.warn(ex);
  }
}

export default warn;

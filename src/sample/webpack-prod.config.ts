import * as config from './webpack.config';

const prodConfig = Object.assign({}, config, { mode: 'production' });

export default prodConfig;

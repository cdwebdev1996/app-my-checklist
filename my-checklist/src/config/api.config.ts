const env = process.env.REACT_APP_NODE_ENV || 'dev';
export const API_CONTEXT = `${process.env.REACT_APP_API_SERVER_HOST}/${env}${process.env.REACT_APP_API_CONTEXT}`
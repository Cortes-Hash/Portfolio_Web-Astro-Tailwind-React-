import pkg from './node_modules/axobject-query/package.json' with { type: 'json' };
console.log('Version:', pkg.version);
console.log('Exports:', JSON.stringify(pkg.exports, null, 2));

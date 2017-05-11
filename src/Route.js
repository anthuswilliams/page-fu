import createState from './createState';
import createProps from './createProps';
import createBoundInterface from './createBoundInterface';
import exposeRoutingAPIs from './exposeRoutingAPIs';
import installActivationGuard from './installActivationGuard';
import morphIntoObject from './morphIntoObject';
import { flow } from 'lodash';

/**
 * @module Route
 *
 * Define a Route handler.
 */
export default flow([
  morphIntoObject,
  createState,
  createProps,
  exposeRoutingAPIs,
  installActivationGuard,
  createBoundInterface
]);


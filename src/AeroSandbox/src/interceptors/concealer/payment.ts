import { APIInterceptor, SupportEnum } from "$types/index.d";

import { proxyGetString } from "$shared/stringProxy";

import rewriteSrc from "$shared/src";

// Only supported on Chromium
export default [
  {
    proxifiedObj: Proxy.revocable(PaymentRequest, {
      construct(target, prop, args) {
        let [methods] = args;

        args[0] = methods.map(method => rewriteSrc(method));

        return Reflect.construct(target, prop, args);
      },
    }),
    globalProp: "PaymentRequest",
    supports: SupportEnum.draft | SupportEnum.shippingChromium,
  },
  {
    proxifiedObj: proxyGetString("MerchantValidationEvent", ["validationURL"]),
    globalProp: "MerchantValidationEvent",
    supports:
      SupportEnum.deprecated | SupportEnum.draft | SupportEnum.shippingChromium,
  },
] as APIInterceptor[];

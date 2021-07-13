import * as React from "react";
import styles from "./COMPONENT_NAME.STYLE_EXT";

const COMPONENT_NAME = React.forwardRef<HTMLDivElement, COMPONENT_NAMEProps>(
	(props, forwardedRef) => {
		return <div {...props} ref={forwardedRef} />;
	}
);

COMPONENT_NAME.displayName = "COMPONENT_NAME";

export { COMPONENT_NAME };

interface COMPONENT_NAMEOwnProps {}
interface COMPONENT_NAMEDomProps
	extends Omit<
		React.ComponentPropsWithRef<"div">,
		keyof COMPONENT_NAMEOwnProps
	> {}
interface COMPONENT_NAMEProps
	extends COMPONENT_NAMEOwnProps,
		COMPONENT_NAMEDomProps {}

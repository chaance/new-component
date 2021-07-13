import * as React from "react";
import styles from "./COMPONENT_NAME.STYLE_EXT";

const COMPONENT_NAME: React.FC<COMPONENT_NAMEProps> = (props) => {
	return <div {...props} />;
};

export { COMPONENT_NAME };

interface COMPONENT_NAMEOwnProps {}
interface COMPONENT_NAMEDomProps
	extends Omit<
		React.ComponentPropsWithoutRef<"div">,
		keyof COMPONENT_NAMEOwnProps
	> {}
interface COMPONENT_NAMEProps
	extends COMPONENT_NAMEOwnProps,
		COMPONENT_NAMEDomProps {}

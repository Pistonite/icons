import { SelectIconButton } from "components/SelectIconButton";
import { getIconUrlCreator, selectIcon, useStore } from "data/store.ts";

export type IconOptionProps = {
    icon: string;
};

export const IconOption: React.FC<IconOptionProps> = ({ icon }) => {
    const selectedIcon = useStore((store) => store.selectedIcon);
    const getUrl = useStore(getIconUrlCreator);
    return (
        <SelectIconButton
            iconName={icon}
            url={getUrl(icon)}
            setIconName={selectIcon}
            selected={icon === selectedIcon}
        />
    );
};

import {useEffect, useState} from 'react';

/**
 * A function that aids in the delay of unmounting a component.
 *
 * @param isMounted
 * @param delayTime
 * @author deckele (https://stackoverflow.com/users/6088926/deckele)
 * @link https://stackoverflow.com/a/54114180
 */
export default function useDelayUnmount(isMounted: boolean, delayTime: number): boolean {
    const [shouldRender, setShouldRender] = useState(false);

    useEffect(() => {
        let timeoutId: number;
        if (isMounted && !shouldRender) {
            setShouldRender(true);
        } else if (!isMounted && shouldRender) {
            // need to cast to `any` to fix NodeJS type conflicts.
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            timeoutId = setTimeout(() => setShouldRender(false), delayTime) as any;
        }

        return () => {
            // ensure timeout cleared on cleanup
            clearTimeout(timeoutId);
        };
    }, [isMounted, delayTime, shouldRender]);

    return shouldRender;
}

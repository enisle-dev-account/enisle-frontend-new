import { ComponentExample } from "@/components/component-example";
import { Icon } from "@/components/icon";
import { Button } from "@/components/ui/button";
import TestIcon from "@/lib/assets/icons/test-icon.svg";

export default function Page() {
return (
<main className="rounded-t-2xl bg-background overflow-hidden">
<ComponentExample />

<div className="mb-8 justify-center flex items-center gap-4">
    <Button>
        Test User
    <Icon name="test-icon" size={16} className="ml-2" />
    </Button>
    <div className="flex items-center gap-4 p-3 bg-black">
    <Icon name="logo" size={92} />

    </div>
</div>
</main>

);
}
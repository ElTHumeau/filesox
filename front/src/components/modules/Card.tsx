import {ReactNode} from "react";

export function Card({children}: {children: ReactNode}) {
  return (
    <div className="border border-gray-200 rounded-md shadow-sm">
        {children}
    </div>
  );
}

export function CardHeader() {
  return (
    <div>

    </div>
  );
}

export function CardBody({children}: {children: ReactNode}) {
  return (
    <div className="p-4">
        {children}
    </div>
  );
}

export function CardTitle() {}

export function CardText() {}

export function CardFooter() {
    return (
        <div>

        </div>
    );
}
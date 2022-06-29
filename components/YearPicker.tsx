import * as React from "react";
import { Listbox, Transition } from "@headlessui/react";
import { atomWithStorage } from "jotai/utils";
import { useAtom } from "jotai";
import cx from "classnames";

import CheckIcon from "@/components/icons/Check";
import type { ExtractAtomValue } from "jotai";

const AllAvailableYears = [
  "2022",
  "2021",
  "2020",
  "2019",
  "2018",
  "2017",
  "2016",
  "2015",
  "2014",
  "2013",
] as const;

export const yearsAtom = atomWithStorage("yearsFilter", AllAvailableYears);
export type Years = ExtractAtomValue<typeof yearsAtom>;

// const formatYears = (years: Years) => {
//   return years.reduce((acc, year) => {
//     let string; // eslint-disable-line prefer-const
//     if (Number(year) - Number(acc) == 1) {
//     }
//   }, "0");
// };

export const YearPicker = () => {
  const [years, setYears] = useAtom(yearsAtom);

  const handleChange = (value: Years) => {
    if (value.length > 0 && value.length < AllAvailableYears.length) {
      setYears(value);
    } else {
      setYears(AllAvailableYears);
    }
  };

  return (
    <Listbox value={years} onChange={handleChange} multiple>
      {({ open }) => (
        <div className="flex max-w-lg items-center rounded-md border border-stone-300 dark:border-stone-500">
          <Listbox.Label className="block px-5 text-sm font-medium text-stone-700 dark:text-stone-100">
            Years
          </Listbox.Label>
          <div className="relative flex-grow rounded-r-md">
            <Listbox.Button className="min-w-[50px] max-w-xs cursor-default truncate rounded-r-md border-l border-stone-300 bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 dark:border-stone-500 dark:bg-stone-600 sm:text-sm">
              {years
                .map(Number)
                .sort()
                .reverse()
                .map((year) => {
                  return (
                    <span
                      key={year}
                      className="mx-px inline-block rounded-sm border border-stone-500/40 bg-white px-1 text-xs dark:bg-stone-900/50 md:text-sm"
                    >
                      {year}
                    </span>
                  );
                })}
              &nbsp;
            </Listbox.Button>

            <Transition
              show={open}
              as={React.Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className="absolute z-10 mt-1 max-h-56 overflow-auto rounded-md bg-stone-50/90 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-stone-900/90 sm:text-sm">
                {AllAvailableYears.map((year, idx) => (
                  <Listbox.Option
                    key={idx}
                    className={({ active }) =>
                      cx(
                        active
                          ? "bg-orange-600 text-white dark:text-stone-900"
                          : "text-stone-900 dark:text-stone-100",
                        "relative cursor-default select-none py-2 pl-3 pr-9"
                      )
                    }
                    value={year}
                  >
                    {({ selected, active }) => (
                      <>
                        <div className="flex items-center">
                          <span
                            className={cx(
                              selected ? "font-semibold" : "font-normal",
                              "ml-3 block truncate"
                            )}
                          >
                            {year}
                          </span>
                        </div>

                        {selected ? (
                          <span
                            className={cx(
                              active ? "text-white" : "text-orange-600",
                              "absolute inset-y-0 right-0 flex items-center pr-4"
                            )}
                          >
                            <CheckIcon
                              className="h-5 w-5 fill-[#0b7261]"
                              aria-hidden="true"
                            />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        </div>
      )}
    </Listbox>
  );
};

export default YearPicker;

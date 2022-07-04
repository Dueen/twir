import * as React from "react";
import { Listbox, Transition } from "@headlessui/react";
import { atomWithStorage } from "jotai/utils";
import { useAtom } from "jotai";
import cx from "classnames";

import CheckIcon from "@/components/icons/Check";
import type { ExtractAtomValue } from "jotai";

const AllAvailableYears = [
  2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015, 2014, 2013,
];

export const yearsAtom = atomWithStorage("yearsFilter", AllAvailableYears);
export type Years = ExtractAtomValue<typeof yearsAtom>;

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
        <div className="flex w-full items-center rounded-md border border-stone-300 bg-white dark:border-stone-500 dark:bg-stone-700">
          <Listbox.Label className="block min-w-[96px] px-5 text-center text-sm font-medium text-stone-700 dark:text-stone-100">
            Years
          </Listbox.Label>
          <div className="relative flex-wrap rounded-r-md">
            <Listbox.Button className="w-full cursor-default rounded-r-md border-l border-stone-300 py-2 pl-3 pr-10 text-left shadow-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 dark:border-stone-500 sm:text-sm">
              {years
                .sort()
                .reverse()
                .map((year) => {
                  return (
                    <span
                      key={year}
                      className="ml-2 mb-1 inline-block min-w-[56px] rounded-sm border border-stone-500/40 bg-stone-50 px-1 text-center text-sm dark:bg-stone-900/50 md:text-sm"
                    >
                      {year}
                    </span>
                  );
                })}
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

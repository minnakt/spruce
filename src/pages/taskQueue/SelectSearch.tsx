import { useState, PropsWithChildren, useRef, useEffect, useMemo } from "react";
import styled from "@emotion/styled";
import Icon from "@leafygreen-ui/icon";
import { uiColors } from "@leafygreen-ui/palette";
import TextInput from "@leafygreen-ui/text-input";
import { Label } from "@leafygreen-ui/typography";
import { useOnClickOutside } from "hooks";

const { gray, white } = uiColors;

interface SelectSearchProps<T> {
  label?: string | React.ReactNode;
  onChange: (value: T | T[]) => void;
  searchFunc?: (options: T[], match: string) => T[];
  searchPlaceholder: T;
  options: T[] | string[];
  optionRenderer?: (option: T, onClick: (selectedV) => void) => React.ReactNode;
  ["data-cy"]?: string;
}
const SelectSearch = <T extends {}>({
  label,
  onChange,
  searchFunc,
  searchPlaceholder,
  options,
  optionRenderer,
  "data-cy": dataCy = "select-search",
}: PropsWithChildren<SelectSearchProps<T>>) => {
  const [isOpen, setisOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [placeholder, setPlaceholder] = useState(null);
  const [visibleOptions, setVisibleOptions] = useState(options);

  const searchSelectRef = useRef(null);
  useOnClickOutside(searchSelectRef, () => setisOpen(false));

  // Set options and placeholder on component load
  useEffect(() => {
    if (options) {
      setVisibleOptions(options);
    }
    setPlaceholder(searchPlaceholder);
  }, [searchPlaceholder, options]);

  const onClick = (v: T) => {
    onChange(v);
    setPlaceholder(v); // set placeholder to clicked value
    setSearch(""); // clear search
    setVisibleOptions(options); // reset visible options
    setisOpen(false);
  };

  const option = (v: T) => optionRenderer(v, onClick);

  const handleSearch = useMemo(
    () => (e: React.ChangeEvent<HTMLInputElement>) => {
      const { value: searchTerm } = e.target;
      setSearch(searchTerm);
      let filteredOptions = [];
      if (searchFunc) {
        // Alias the array as any to avoid TS error https://github.com/microsoft/TypeScript/issues/36390
        filteredOptions = searchFunc(options as T[], searchTerm);
      } else {
        // assume options are plain strings
        filteredOptions = (options as string[]).filter(
          (o) => o.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1
        );
      }
      setVisibleOptions(filteredOptions);
    },
    [searchFunc, options]
  );

  return (
    <>
      {label && <Label htmlFor="select-search">{label}</Label>}
      <SearchSelectWrapper ref={searchSelectRef}>
        <TextInputWrapper>
          <TextInput
            spellCheck={false}
            aria-label="select-search-input"
            type="search"
            placeholder={placeholder}
            value={search}
            onChange={handleSearch}
            onClick={() => setisOpen(true)}
          />
          <StyledIcon
            glyph="MagnifyingGlass"
            onClick={() => setisOpen((curr) => !curr)}
          />
        </TextInputWrapper>

        {isOpen && (
          <RelativeWrapper>
            <OptionsWrapper data-cy={`${dataCy}-options`}>
              {(visibleOptions as T[])?.map((o) => option(o))}
            </OptionsWrapper>
          </RelativeWrapper>
        )}
      </SearchSelectWrapper>
    </>
  );
};

const SearchSelectWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 300px;
  margin-bottom: 10px;
`;
const TextInputWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  margin-top: 20px;
`;
const StyledIcon = styled(Icon)`
  position: absolute;
  height: 100%;
  justify-content: center;
  align-self: flex-end;
  margin-right: 10px;
  &:hover {
    cursor: pointer;
  }
`;
// Used to provide a basis for the absolutely positions OptionsWrapper
const RelativeWrapper = styled.div`
  position: relative;
`;
const OptionsWrapper = styled.div`
  border-radius: 5px;
  background-color: ${white};
  border: 1px solid ${gray.light1};
  padding: 8px;
  box-shadow: 0 3px 8px 0 rgba(231, 238, 236, 0.5);
  position: absolute;
  z-index: 5;
  margin-top: 5px;
  width: 100%;
  white-space: nowrap;
`;

export default SelectSearch;

using FamilyTree.Application.People.ViewModels;
using System.Collections.Generic;

namespace FamilyTree.Application.FamilyTrees.ViewModels
{
    public class FamilyTreeVm
    {
        public PersonDto MainPerson { get; set; } // главный персонаж
        public PersonDto Parent_1 { get; set; } // первый родитель
        public PersonDto Parent_2 { get; set; } // второй родитель
        public PersonDto Grand_1_1 { get; set; } // первый родитель 1-го родителя (бабушка/дедушка)
        public PersonDto Grand_1_2 { get; set; } // второй родитель 1-го родителя (бабушка/дедушка)
        public PersonDto Grand_2_1 { get; set; } // первый родитель 2-го родителя (бабушка/дедушка)
        public PersonDto Grand_2_2 { get; set; } // второй родитель 2-го родителя (бабушка/дедушка)
        public List<PersonDto> Brothers { get; set; } // братья
        public List<PersonDto> Wifes { get; set; } // жены
        public PersonDto Parent_W_1 { get; set; } // первый родитель жены
        public PersonDto Parent_W_2 { get; set; } // второй родитель жены
        public PersonDto Grand_W_1_1 { get; set; } // первый родитель 1-го родителя жены (бабушка/дедушка жены)
        public PersonDto Grand_W_1_2 { get; set; } // второй родитель 1-го родителя жены (бабушка/дедушка жены)
        public PersonDto Grand_W_2_1 { get; set; } // первый родитель 2-го родителя жены (бабушка/дедушка жены)
        public PersonDto Grand_W_2_2 { get; set; }// второй родитель 2-го родителя жены (бабушка/дедушка жены)
        public List<PersonDto> Children { get; set; } // дети
        public PersonDto ChildWife_2 { get; set; } // ребенок от второго брака

        public bool[] Grand_has_parent { get; set; } // есть ли у бабушек/дедушек родители
        public bool[] Grand_has_another_child { get; set; } // есть ли у бабушек/дедушек дети от другого брака
        public bool[] Parent_has_brother { get; set; } // есть ли у родителей братья/сестры
        public bool[] Parent_has_another_child { get; set; } // есть ли у родителей ребенок от другого брака
        public bool WifeBrother { get; set; } // есть ли у жены братья/сестры           
        public bool Wife_2_has_parent { get; set; } // есть ли у второй жены родители
        public bool[] BrothersSons { get; set; } // есть ли у братьев дети
        public bool Child_Wife_3 { get; set; } // есть ли ребенок от 3-й жены
        public bool[] Wife_has_another_child { get; set; } // есть ли у 1 и 2 жен дети от других браков
        public bool CountChildrenWife_2 { get; set; } // количество детей у 2-й жены больше 1
        public bool[] Child_has_sons { get; set; } // есть ли у детей дети
        public bool Child_Another_has_sons { get; set; } // есть ли у ребенка второго брака дети
    }
}
